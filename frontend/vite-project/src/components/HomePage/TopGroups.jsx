import React from 'react'
import { useState } from 'react'
import { topFiveGroup } from '../../core/services/homepage/fetchTopGroup'
import { useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel'

const TopGroups = () => {
    const [dataGroups, setDataGroups] = useState([])

    const getGroups = async() => {
        try {
            const data = await topFiveGroup()
             console.log(data)
            if(data.FiveGroup && Array.isArray(data.FiveGroup)){
                setDataGroups(data.FiveGroup)
               
            }
            else{
                setDataGroups([])
            }
        } catch (error) {
             console.error("Error:", error);
        setTopPost([]);
        }
    }

    useEffect(() => {
        getGroups()
    },[])
  return (
    <div className='containerGroup mt-3 d-flex flex-column ' >
      <div>
        <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop
            swipeable
            emulateTouch
            showArrows={true}
            centerMode={false}
            autoFocus={false}
            useKeyboardArrows
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="carousel-arrow left-arrow"
                >
                  ‹
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="carousel-arrow right-arrow"
                >
                  ›
                </button>
              )
            }
            className="single-card-carousel w-100 position-relative">
        {dataGroups.map((g, idx) => (
            <div className='d-flex flex-column gap-3 mt-2 justify-content-center'key={idx}>
                <div>
                    <span className='titleGroup'>{g.name}</span>
                </div>
                <div className='containerImgGroupList d-flex justify-content-center align-items-center'>
                <img className='imgGroupListTop' src={g.photoGroup} alt="" />
                </div>
               
               <div>
                <span className='textMembers'>Miembros: {g.membersCount}</span>
                
               </div>
               
                <div>
                   <span className='textDescription'> {g.description}</span> 
                </div>

            </div>
        ))}
        </Carousel>
      </div>
    </div>
  )
}

export default TopGroups
